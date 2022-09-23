import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
  
  public type Message = {
    text: Text;
    time: Time.Time;
    author: Text;
  };

  public type Microblog = actor {
    follow: shared (Principal) -> async();
    follows: shared query () -> async [Principal];
    post: shared (Text) -> async();
    posts: shared query (since: Time.Time) -> async [Message];
    timeline: shared (since: Time.Time) -> async [Message];
  };

  stable var followed : List.List<Principal> = List.nil();
  stable var messages : List.List<Message> = List.nil();
  stable var author: Text = "anonymous";

  public shared func follow(id: Principal) : async() {
    followed := List.push(id, followed);
  };

  public shared query func follows() : async [Principal] {
    List.toArray(followed)
  };

  public shared func post(otp: Text, text: Text) : async () {
    assert(otp == "123456");
    messages := List.push({
        text = text;
        time = Time.now();
        author = author;
    }, messages);
  };

  public shared func remove_follows() : async () {
    followed := List.nil();
  };

  public shared query func posts(since: Time.Time) : async [Message] {
    List.toArray(
        List.filter(messages, func (message: Message) : Bool {
            since <= message.time
        })
    )
  };

  public shared func timeline(since: Time.Time) : async [Message] {
    var all : List.List<Message> = List.nil();

    for (id in Iter.fromList(followed)) {
        let canister : Microblog = actor(Principal.toText(id));
        let msgs = await canister.posts(since);
        for (msg in Iter.fromArray(msgs)) {
            all := List.push(msg, all);
        };

    };
    List.toArray(all)

  };
  
  public func set_name(_author : Text) : async () {
    author := _author;
  };
  
  public func get_name() : async Text {
    author
  };
};
